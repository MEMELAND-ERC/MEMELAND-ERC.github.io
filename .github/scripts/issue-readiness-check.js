const READY_LABEL = '🤖 ready-for-copilot';
const NEEDS_INFO_LABEL = '❓ status:needs-info';
const NO_AGENT_LABEL = '⏸️ no-agent';

// Hidden marker that identifies the single status comment this check maintains.
const STATUS_MARKER = '<!-- memeland-readiness -->';

const TITLE_PREFIXES = {
  '[New news]:': 'news',
  '[Update content]:': 'update-content',
  '[Media]:': 'media',
  '[Language correction]:': 'language-correction',
  '[Bug]:': 'bug',
  '[New output]:': 'output',
};

// Fallback when the submitter edited the title prefix away.
const TYPE_LABELS = {
  '📰 type:news-post': 'news',
  '✏️ type:update-content': 'update-content',
  '🖼️ type:media': 'media',
  '🔤 type:language-correction': 'language-correction',
  '🐞 type:bug': 'bug',
  '📄 type:output': 'output',
};

const LANGUAGE_NAMES = ['English', 'German', 'French', 'Czech', 'Norwegian'];
const MEMELAND_URL_RE = /^https?:\/\/(?:www\.)?(?:memeland\.no|memeland-erc\.github\.io)\//i;
// Matches the per-language placeholders of template 02, e.g.
// "Write the new English text here." and "Write the French text here."
const LANGUAGE_PLACEHOLDER_RE = /^Write the (?:new )?\w+ text here/i;
const SAME_AS_ENGLISH_RE = /^same as english\.?$/i;

function normalize(text) {
  return (text || '').replace(/\r\n/g, '\n').trim();
}

function unwrapCodeFence(text) {
  const value = normalize(text);
  const match = value.match(/^```[^\n]*\n([\s\S]*?)\n```$/);
  return match ? match[1].trim() : value;
}

function isChecked(value) {
  return /- \[[xX]\]/.test(value || '');
}

function countChecked(value) {
  return ((value || '').match(/- \[[xX]\]/g) || []).length;
}

function parseSections(body) {
  const sections = {};
  const lines = normalize(body).split('\n');
  let currentHeading = null;
  let currentLines = [];
  let inFence = false;

  const commit = () => {
    if (currentHeading) {
      sections[currentHeading] = normalize(currentLines.join('\n'));
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      inFence = !inFence;
    }
    if (!inFence && line.startsWith('### ')) {
      commit();
      currentHeading = line.slice(4).trim();
      currentLines = [];
      continue;
    }
    if (currentHeading) {
      currentLines.push(line);
    }
  }
  commit();
  return sections;
}

function parseLanguageContent(text) {
  const blocks = {};
  const lines = unwrapCodeFence(text).split('\n');
  let currentHeading = null;
  let currentLines = [];

  const commit = () => {
    if (currentHeading) {
      blocks[currentHeading] = normalize(currentLines.join('\n'));
    }
  };

  for (const line of lines) {
    if (line.startsWith('### ')) {
      commit();
      currentHeading = line.slice(4).trim();
      currentLines = [];
      continue;
    }
    if (currentHeading) {
      currentLines.push(line);
    }
  }
  commit();
  return blocks;
}

function getTemplate(issue) {
  const title = normalize(issue.title);
  const fromTitle = Object.entries(TITLE_PREFIXES).find(([prefix]) => title.startsWith(prefix))?.[1];
  if (fromTitle) return fromTitle;
  const labels = issue.labels || [];
  return Object.entries(TYPE_LABELS).find(([label]) => labels.includes(label))?.[1] || null;
}

function isPlaceholderText(value, placeholders = []) {
  const text = unwrapCodeFence(value);
  return !text || placeholders.some((placeholder) => text === normalize(placeholder));
}

function isUrlValid(value) {
  return MEMELAND_URL_RE.test(normalize(value));
}

function validateNews(sections, reasons) {
  if (isPlaceholderText(sections['News title'], ['UiT team completes successful coring campaign in Iceland'])) {
    reasons.push('News title is missing or still uses the placeholder text.');
  }
  const activityDate = normalize(sections['Date of the activity or event']);
  if (!activityDate) {
    reasons.push('Date of the activity or event is missing.');
  }
  if (isPlaceholderText(sections['Short summary (shown in the news card)'], ['The UiT team retrieved a 4-metre sediment core from Lake Mývatn during a two-week field campaign.'])) {
    reasons.push('Short summary is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['Full story'], [
    `Write a short introductory paragraph here.

## Background

Why is this activity important for MEMELAND?

## Details

What happened? Where? Who was involved? What were the outcomes?

## Resources

- [Link title](https://example.com)`,
  ])) {
    reasons.push('Full story is missing or still uses the template skeleton.');
  }
  if (countChecked(sections['Content and photo rights']) < 2) {
    reasons.push('Both content and photo rights confirmations must be checked.');
  }
}

function validateUpdateContent(sections, reasons) {
  if (!isUrlValid(sections['URL of the page to update'])) {
    reasons.push('URL of the page to update is missing or is not a MEMELAND URL.');
  }
  if (countChecked(sections['Which language version(s) need updating?']) < 1) {
    reasons.push('At least one language version must be selected.');
  }
  if (!normalize(sections['Type of update'])) {
    reasons.push('Type of update must be selected.');
  }

  const newText = sections['Replacement or new text'];
  if (isPlaceholderText(newText, [
    `### English
Write the new English text here.

### German
Write the German text here (or write "same as English" if not applicable).

### French
Write the French text here.

### Czech
Write the Czech text here.

### Norwegian
Write the Norwegian text here.`,
  ])) {
    reasons.push('Replacement or new text is missing or still uses the template placeholder text.');
  } else {
    const selectedLanguages = (sections['Which language version(s) need updating?'] || '')
      .split('\n')
      .filter((line) => /- \[[xX]\]/.test(line))
      .map((line) => line.replace(/^- \[[xX]\]\s*/, '').replace(/\s+\(.*\)$/, '').trim());
    const languageBlocks = parseLanguageContent(newText);
    // Without any "### <Language>" heading, the whole text applies to every
    // selected language (e.g. a name or an e-mail address).
    const hasLanguageHeadings = LANGUAGE_NAMES.some((language) => language in languageBlocks);
    const textFor = (language) =>
      hasLanguageHeadings ? normalize(languageBlocks[language]) : unwrapCodeFence(newText);
    const englishText = textFor('English');
    const hasRealEnglishText =
      Boolean(englishText) &&
      !LANGUAGE_PLACEHOLDER_RE.test(englishText) &&
      !SAME_AS_ENGLISH_RE.test(englishText);

    for (const language of selectedLanguages) {
      const content = textFor(language);
      if (!content) {
        reasons.push(`Replacement or new text is missing for ${language}.`);
        continue;
      }
      if (LANGUAGE_PLACEHOLDER_RE.test(content)) {
        reasons.push(`Replacement or new text for ${language} still uses the template placeholder.`);
        continue;
      }
      // "same as English" is fine for other languages: the agent copies
      // language-neutral text and translates prose (flagged in the PR).
      if (SAME_AS_ENGLISH_RE.test(content)) {
        if (language === 'English') {
          reasons.push('Replacement or new text for English cannot be "same as English".');
        } else if (!hasRealEnglishText) {
          reasons.push(`Replacement or new text for ${language} says "same as English", but no English text is provided.`);
        }
      }
    }
  }

  if (!isChecked(sections['Rights confirmation'])) {
    reasons.push('Rights confirmation must be checked.');
  }
}

function validateMedia(sections, reasons) {
  if (!isUrlValid(sections['URL of the page to update'])) {
    reasons.push('URL of the page to update is missing or is not a MEMELAND URL.');
  }
  if (!normalize(sections['What should happen with the image?'])) {
    reasons.push('Image action must be selected.');
  }
  const asset = unwrapCodeFence(sections['Image file or URL']);
  const assetMatch = asset.match(/^Image URL or attachment:\s*\n([\s\S]*?)\n\s*Where on the page should it appear:\s*\n([\s\S]*)$/i);
  const assetSource = normalize(assetMatch ? assetMatch[1] : asset);
  if (!assetSource || isPlaceholderText(sections['Image file or URL'], ['Image URL or attachment:\n\nWhere on the page should it appear:'])) {
    reasons.push('Image file or URL must be provided.');
  }

  const altCaption = normalize(sections['Alt text and caption']);
  if (!altCaption || /^Alt text \(describe the image for screen readers\):\s*(?:Caption \(optional, shown below the image\):)?$/is.test(altCaption)) {
    reasons.push('Alt text must be provided.');
  }

  if (!isChecked(sections['Rights confirmation'])) {
    reasons.push('Rights confirmation must be checked.');
  }
}

function validateLanguageCorrection(sections, reasons) {
  if (countChecked(sections['Which language version contains the error?']) < 1) {
    reasons.push('At least one language version must be selected.');
  }
  if (!isUrlValid(sections['URL of the page with the error'])) {
    reasons.push('URL of the page with the error is missing or is not a MEMELAND URL.');
  }
  if (isPlaceholderText(sections['Current (incorrect) text'], ['...the team recieved a sediment core from...'])) {
    reasons.push('Current (incorrect) text is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['Corrected text'], ['...the team retrieved a sediment core from...'])) {
    reasons.push('Corrected text is missing or still uses the placeholder text.');
  }
}

function validateBug(sections, reasons) {
  if (!isUrlValid(sections['URL of the affected page'])) {
    reasons.push('URL of the affected page is missing or is not a MEMELAND URL.');
  }
  if (isPlaceholderText(sections['What is wrong?'], ['Describe the problem here.'])) {
    reasons.push('What is wrong? is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['What should happen instead?'], ['Describe the expected behaviour here.'])) {
    reasons.push('What should happen instead? is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['Steps to reproduce'], ['1. Go to ...\n2. Click on ...\n3. See ...'])) {
    reasons.push('Steps to reproduce is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['Browser and device'], ['Chrome 124 on Windows 11, or Safari on iPhone 15'])) {
    reasons.push('Browser and device is missing.');
  }
}

function validateOutput(sections, reasons) {
  if (!normalize(sections['Type of output'])) {
    reasons.push('Type of output must be selected.');
  }
  if (isPlaceholderText(sections['Author(s)'], ['Smith J, Doe A'])) {
    reasons.push('Author(s) is missing or still uses the placeholder text.');
  }
  const year = normalize(sections['Year']);
  if (!/^\d{4}$/.test(year)) {
    reasons.push('Year must be a 4-digit value.');
  }
  if (isPlaceholderText(sections['Title'], ['Lake sediment archives reveal Holocene climate variability in northern Europe'])) {
    reasons.push('Title is missing or still uses the placeholder text.');
  }
  if (isPlaceholderText(sections['DOI or URL'], ['https://doi.org/10.xxxx/xxxxx'])) {
    reasons.push('DOI or URL is missing or still uses the placeholder text.');
  }
  if (!isChecked(sections['Rights confirmation'])) {
    reasons.push('Rights confirmation must be checked.');
  }
}

function evaluateIssue(issue) {
  const template = getTemplate(issue);
  const reasons = [];
  const sections = parseSections(issue.body || '');

  if (!template) {
    reasons.push('Issue title does not match a supported MEMELAND issue template.');
    return { ready: false, reasons, template: null };
  }

  switch (template) {
    case 'news':
      validateNews(sections, reasons);
      break;
    case 'update-content':
      validateUpdateContent(sections, reasons);
      break;
    case 'media':
      validateMedia(sections, reasons);
      break;
    case 'language-correction':
      validateLanguageCorrection(sections, reasons);
      break;
    case 'bug':
      validateBug(sections, reasons);
      break;
    case 'output':
      validateOutput(sections, reasons);
      break;
    default:
      reasons.push('Issue template is not supported by the readiness checker.');
  }

  return { ready: reasons.length === 0, reasons, template };
}

async function addLabels(github, issue, labels) {
  if (!labels.length) return;
  await github.rest.issues.addLabels({
    owner: issue.owner,
    repo: issue.repo,
    issue_number: issue.number,
    labels,
  });
}

async function removeLabel(github, issue, label) {
  try {
    await github.rest.issues.removeLabel({
      owner: issue.owner,
      repo: issue.repo,
      issue_number: issue.number,
      name: label,
    });
  } catch (error) {
    if (error.status !== 404) throw error;
  }
}

function statusCommentBody(result) {
  if (result.ready) {
    return [
      STATUS_MARKER,
      '✅ **Thank you! Your request has everything it needs.**',
      '',
      'The website assistant (GitHub Copilot) will now start working on it and open a pull request for the website maintainer to review. The pull request will appear on this issue within a few minutes.',
    ].join('\n');
  }
  return [
    STATUS_MARKER,
    '👋 **Thank you for your request!** Before the website assistant can start, please complete the following:',
    '',
    ...result.reasons.map((reason) => `- ${reason}`),
    '',
    'To do so, edit the issue (click **···** at the top right of the issue text, then **Edit**) and save. This check runs again automatically every time you save.',
    '',
    'If anything is unclear, mention `@OndrejMottl` in a comment.',
  ].join('\n');
}

// Keep exactly one status comment per issue and edit it in place, so repeated
// edits do not flood the issue with bot comments.
async function upsertStatusComment(github, issue, body) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner: issue.owner,
    repo: issue.repo,
    issue_number: issue.number,
    per_page: 100,
  });
  const existing = comments.find((comment) => (comment.body || '').startsWith(STATUS_MARKER));

  if (!existing) {
    await github.rest.issues.createComment({
      owner: issue.owner,
      repo: issue.repo,
      issue_number: issue.number,
      body,
    });
    return 'created';
  }
  if (existing.body === body) {
    return 'unchanged';
  }
  await github.rest.issues.updateComment({
    owner: issue.owner,
    repo: issue.repo,
    comment_id: existing.id,
    body,
  });
  return 'updated';
}

async function run({ github, context, core }) {
  const payloadIssue = context.payload.issue;
  const labels = (payloadIssue.labels || []).map((label) => label.name);
  const issue = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    number: payloadIssue.number,
    title: payloadIssue.title || '',
    body: payloadIssue.body || '',
    labels,
  };

  if (payloadIssue.state === 'closed') {
    core.notice('Issue is closed; skipping readiness check.');
    return { ready: false, template: null, optedOut: false, closed: true };
  }

  const result = evaluateIssue(issue);
  const optedOut = labels.includes(NO_AGENT_LABEL);

  core.notice(`Template: ${result.template || 'unsupported'}`);
  if (result.reasons.length) {
    core.notice(`Reasons: ${result.reasons.join(' | ')}`);
  }

  if (optedOut) {
    await removeLabel(github, issue, READY_LABEL);
    core.notice('Issue is opted out via ⏸️ no-agent; skipping readiness label updates.');
    return { ready: result.ready, template: result.template, optedOut: true, closed: false };
  }

  if (result.ready) {
    await removeLabel(github, issue, NEEDS_INFO_LABEL);
    await addLabels(github, issue, [READY_LABEL]);
    core.notice('Issue is ready for Copilot.');
  } else {
    await removeLabel(github, issue, READY_LABEL);
    await addLabels(github, issue, [NEEDS_INFO_LABEL]);
    core.notice('Issue is not ready for Copilot.');
  }

  // Only talk to submitters of template issues; maintainers' own issues
  // (no template) get labels but no bot comment.
  if (result.template) {
    const outcome = await upsertStatusComment(github, issue, statusCommentBody(result));
    core.notice(`Status comment: ${outcome}.`);
  }

  return { ready: result.ready, template: result.template, optedOut: false, closed: false };
}

module.exports = run;
module.exports.evaluateIssue = evaluateIssue;
module.exports.statusCommentBody = statusCommentBody;
module.exports.STATUS_MARKER = STATUS_MARKER;
