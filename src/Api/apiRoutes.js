const routes = {
  fetchTasks: "/tasks/get-task",
  createTask: "/tasks/create-task",
  updateTask: (id) => `/tasks/update-task/${id}`,
  deleteTask: (id) => `/tasks/delete-task/${id}`,
  deleteAllTask: "/tasks/delete-all-task",
  getSubjects: (term, year) => `/course/getSubjects/${term}/${year}`,
  uploadResource: "/resources",
  fetchResources: "/resources",
  fetchAdminResources: "/resources/adminResources",
  updateResource: (id) => `/resources/update/${id}`,
  fetchGrades: "/grades",
  fetchGradesByCourseId: (id) => `/grades/${id}`,
  getProgress: "/grades/progress",
  getNotifications: "/notifications",
  addnotebook:"/notebook/addnotebook",
  fetchNotebooks:"/notebook/getnotebook",
  deleteNotebook: (id) => `/notebook/deletenotebook/${id}`,
  updateNotebook: (id) => `/notebook/updatenotebook/${id}`
};

export default routes;
