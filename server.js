const http = require("http");
const app = require("./app");
const db = require("./db/db");

const port = process.env.PORT || 3000;

db.connect();

const server = http.createServer(app);
server.listen(port, () => {
  console.log("Server started on port 3000");

  console.log("\nRoutes available:\n-----------------\n");
  console.log("(POST) /api/student/signup\n(POST) /api/student/login");
  console.log(
    "(DEL)  /api/student/delete (Admin)\n(GET)  /api/student/list (Admin)"
  );
  console.log(
    "(POST) /api/student/change_password\n(POST) /api/student/reset_password\n"
  );
  console.log("(POST) /api/upload/image\n\n(POST) /api/identify\n");
});

/*
 * /api/upload/image
 * /api/upload/student
 */
