const BUG_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}



function query(filterBy = {}, sortBy) {
  return axios.get(`/api/bug`, { params: { ...filterBy, ...sortBy } })
    .then(res => {
      return res.data
    })

}




function getById(bugId) {
  return axios.get(`/api/bug/${bugId}`).then(res => res.data)
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`).then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    console.log('bug :>> ', bug);
    return axios.put(`/api/bug/${bug._id}`, bug)
    .then(res => res.data)
  } else {
    console.log('bug :>> ', bug);
    return axios.post(`/api/bug`, bug)
      .then(res => res.data)
  }
}

function getEmptyBug(title = '', description = '', severity = 0, createdAt = 0) {
  return { id: '', title, description, severity, createdAt }
}
