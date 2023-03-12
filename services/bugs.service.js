const fs = require('fs')

const gBugs = require('../data/bugs.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}
const PAGE_SIZE = 3

function query(filterBy = { title: '', page: 0, createdAt: null, severity: null }, sortBy) {
  //HERE
  sortBy.by === 'title'
    ? gBugs.sort((bug1, bug2) => (bug1[sortBy.by].localeCompare(bug2[sortBy.by])) * sortBy.desc)
    : gBugs.sort((bug1, bug2) => (bug1[sortBy.by] - bug2[sortBy.by]) * sortBy.desc)

  const regex = new RegExp(filterBy.title, 'i')
  var bugs = gBugs.filter(bug => regex.test(bug.title))

  if (filterBy.labels) {
    bugs = bugs.filter(bug => {
      return filterBy.labels.some(label => bug.labels.includes(label))
    })
  }

  if (filterBy.severity) {
    bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
  }
  //HERE
  const totalPages = Math.ceil(gBugs.length / PAGE_SIZE)
  const startIdx = filterBy.page * PAGE_SIZE
  bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)

  //HERE - SENDING BACK TOTALPAGES
  return Promise.resolve({
    totalPages,
    bugs
  })
}

function getById(bugId) {
  const bug = gBugs.find(bug => bug._id === bugId)
  if (!bug) return Promise.reject('Unknown bug')
  return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
  const idx = gBugs.findIndex(bug => bug._id === bugId)
  if (idx === -1) return Promise.reject('Unknown bug')

  if (gBugs[idx].owner._id !== loggedinUser._id && !loggedinUser.isAdmin) {
    return Promise.reject('Not authorized to delete this ')
  }
  gBugs.splice(idx, 1)
  return _saveBugsToFile()
}

function save(bug, loggedinUser) {
  let savedBug
  if (bug._id) {
    savedBug = gBugs.find(currBug => currBug._id === bug._id)
    if (!savedBug) return Promise.reject('Unknown bug')
    if (savedBug.owner._id !== loggedinUser._id && !loggedinUser.isAdmin) return Promise.reject('Not your bug')
    savedBug.title = bug.title
    savedBug.description = bug.description
    savedBug.severity = bug.severity
    savedBug.createdAt = bug.createdAt
  } else {
    savedBug = {
      _id: _makeId(),
      owner: loggedinUser,
      title: bug.title,
      description: bug.description,
      severity: bug.severity,
      createdAt: Date.now(),
    }
    gBugs.push(savedBug)
  }
  return _saveBugsToFile().then(() => { return savedBug })
}

function _makeId(length = 5) {
  var txt = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(gBugs, null, 2)

    fs.writeFile('data/bugs.json', data, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}
