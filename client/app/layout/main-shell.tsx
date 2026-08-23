'use client'
import Sidebar from "./sidebar";

const MainShell = ({ children }) => {
  return (
    <div>
      <Sidebar content={children} />
    </div>
  );
};

export default MainShell;
