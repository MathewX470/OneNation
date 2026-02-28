import useMiddleManStore from "../../store/commonStore";

function AdminHeader() {
  const { logout } = useMiddleManStore((state) => state);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Civic Management - Super Admin</h1>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminHeader;