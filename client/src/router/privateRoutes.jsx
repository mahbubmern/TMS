// export private routes

import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Dashboard/Users/Users";
import Department from "../pages/Dashboard/Department/Department";
import Layout from "../components/Layouts/Layout";
import PrivateGuard from "./PrivateGuard";
import Incoming from "../pages/Dashboard/Incoming/Incoming";
import Outgoing from "../pages/Dashboard/Outgoing/Outgoing";
import Profile from "../pages/Dashboard/Profile/Profile";
import TaskList from "../pages/Dashboard/TaskList/TaskList";
import TodaysIncoming from "../pages/Dashboard/TodaysIncoming/TodaysIncoming";
import FileManager from "../pages/Dashboard/FileManger/FileManager";

export const privateRoutes = [
  {
    element: <PrivateGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/dashboard/department",
            element: <Department />,
          },
          {
            path: "/dashboard/todays-incoming",
            element: <TodaysIncoming />,
          },
          {
            path: "/dashboard/users",
            element: <Users />,
          },

          {
            path: "/dashboard/incoming",
            element: <Incoming />,
          },

          {
            path: "/dashboard/outgoing",
            element: <Outgoing />,
          },
          {
            path: "/dashboard/file_manager",
            element: <FileManager />,
          },
          {
            path: "/dashboard/settings",
            element: <Profile />,
          },
          {
            path: "/dashboard/task",
            element: <TaskList />,
          },
        ],
      },
    ],
  },
];
