import { useNavigate } from "react-router-dom";

function RequestCard({ request, isAdmin = false }) {
  const navigate = useNavigate();

  // Status styling based on Open/In Progress/Resolved
  const statusStyle =
    request.status === "Open"
      ? "bg-red-100 text-red-800 border border-red-300"
      : request.status === "In Progress"
      ? "bg-orange-100 text-orange-800 border border-orange-300"
      : "bg-green-100 text-green-800 border border-green-300";

  return (
    <div
      onClick={() =>
  navigate(
    isAdmin
      ? `/admin/request/${request._id}`
      : `/request/${request._id}`
  )
}
      className="
        bg-white
        border border-gray-300
        rounded-md
        transition-all duration-200
        hover:border-[#0B3D91]
        hover:shadow-sm
        hover:-translate-y-[2px]
        cursor-pointer
      "
    >
      {/* Image Section */}
      {request.photo && (
        <div className="border-b border-gray-300">
          <img
            src={request.photo}
            alt="request"
            className="w-full h-44 object-cover rounded-t-md"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title + Status */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">
            {request.subject}
          </h3>

          <span className={`px-3 py-1 text-xs font-semibold ${statusStyle}`}>
            {request.status}
          </span>
        </div>

        {/* Location */}
       <p className="text-sm text-gray-600 mt-2">
  Location:
  {request.location
    ? ` ${request.location.lat}, ${request.location.lng}`
    : " Not Available"}
</p>

        {/* Upvotes */}
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
          🔼 {request.upvotes} Upvotes
        </p>

        {/* Case ID */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Case Reference No: GOV-{request._id}
        </div>
      </div>
    </div>
  );
}

export default RequestCard;