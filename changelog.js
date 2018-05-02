#!/usr/bin/env node
const fs = require('fs');
const showdown = require('showdown');
const process = require('child_process');
const repo = 'https://gitlab.com/qaobee/qaobee-tracking';
let md =
`Qaobee-Tracking
---

`;
let tagList = process.execSync('git tag --sort=-committerdate | head -n 10').toString().split('\n');
let lastTag = tagList[0];
lastTag = lastTag || 'HEAD';
tagList = tagList.slice(1, -1);
if (tagList.length === 0) {
  tagList.push(process.execSync('git rev-list --max-parents=0 HEAD').toString().split('\n')[0]);
}
tagList.forEach(tag => {
  md += `## ${lastTag}
  
  `;
  process.execSync(`git log --no-merges --date=iso --format="> +  ts%ct  | %s %N (*[%cN](%ce) | [view commit](${repo}/commit/%H)*)" ${tag}..${lastTag}`)
    .toString().split('\n').forEach(l => {
    let timestamp = /ts([0-9]+)/.exec(l);
    if (timestamp) {
      l = l.replace('ts' + timestamp[1], new Date(timestamp[1] * 1000).toISOString().split('T')[0].replace(/\-/gi, '/'));
    }
    let issue = /#([0-9]+)/.exec(l);
    if (issue) {
      l = l.replace('#' + issue[1], `[#${issue[1]}](${repo}/issues/${issue[1]})`);
    }
    md += l + '\n';
  });
  lastTag = tag;
});
console.log(md);
if(!fs.existsSync('build/docs/changelog')) {
  fs.mkdirSync('build/docs/changelog');
}
fs.writeFileSync('build/docs/changelog/index.html', new showdown.Converter().makeHtml(md));
