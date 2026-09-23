const READY_LABEL = '🤖 ready-for-copilot';
const NEEDS_INFO_LABEL = '❓ status:needs-info';
const NO_AGENT_LABEL = '⏸️ no-agent';

const TITLE_PREFIXES = {
  '[New news]:': 'news',
  '[Update content]:': 'update-content',
  '[Media]:': 'media',
  '[Language correction]:': 'language-correction',
  '[Bug]:': 'bug',
  '[New output]:': 'output',
};

const LANGUAGE_NAMES = ['English', 'German', 'French', 'Czech', 'Norwegian'];
const MEMELAND_URL_RE = /^https?:\/\/(?:www\.)?(?:memeland\.no|memeland-erc\.github\.io)\//i;

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
  return Object.entries(TITLE_PREFIXES).find(([prefix]) => title.startsWith(prefix))?.[1] || null;
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
  if (isPlaceholderText(sections['Date of the activity or event'], ['2026-03-10'])) {
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
    for (const language of selectedLanguages) {
      const content = normalize(languageBlocks[language]);
      if (!content) {
        reasons.push(`Replacement or new text is missing for ${language}.`);
        continue;
      }
      if (/^same as english$/i.test(content)) {
        reasons.push(`Replacement or new text for ${language} cannot be "same as English".`);
      }
      if (/^Write the new .* text here/i.test(content)) {
        reasons.push(`Replacement or new text for ${language} still uses the template placeholder.`);
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
  if (isPlaceholderText(sections['Image file or URL'], ['Image URL or attachment:\n\nWhere on the page should it appear:'])) {
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

async function run({ github, context, core }) {
  const labels = (context.payload.issue.labels || []).map((label) => label.name);
  const issue = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    number: context.payload.issue.number,
    title: context.payload.issue.title || '',
    body: context.payload.issue.body || '',
  };

  const result = evaluateIssue(issue);
  const hasNoAgent = labels.includes(NO_AGENT_LABEL);

  core.notice(`Template: ${result.template || 'unsupported'}`);
  if (result.reasons.length) {
    core.notice(`Reasons: ${result.reasons.join(' | ')}`);
  }

  if (result.ready) {
    await removeLabel(github, issue, NEEDS_INFO_LABEL);
    if (hasNoAgent) {
      await removeLabel(github, issue, READY_LABEL);
      core.notice('Issue content is ready, but automation is opted out via ⏸️ no-agent.');
      return;
    }
    await addLabels(github, issue, [READY_LABEL]);
    core.notice('Issue is ready for Copilot.');
    return;
  }

  await removeLabel(github, issue, READY_LABEL);
  await addLabels(github, issue, [NEEDS_INFO_LABEL]);
  core.notice('Issue is not ready for Copilot.');
}

module.exports = run;
module.exports.evaluateIssue = evaluateIssue;
