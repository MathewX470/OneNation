import { useNavigate } from "react-router-dom";

function RequestCard({ request }) {
  const navigate = useNavigate();

  const statusStyle =
    request.status === "Pending"
      ? "bg-red-100 text-red-800 border border-red-300"
      : request.status === "Ongoing"
      ? "bg-orange-100 text-orange-800 border border-orange-300"
      : "bg-green-100 text-green-800 border border-green-300";

  return (
    <div
      onClick={() => navigate(`/request/${request.id}`)}
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
      {request.image && (
        <div className="border-b border-gray-300">
          <img
            src={request.image}
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
            {request.title}
          </h3>

          <span
            className={`px-3 py-1 text-xs font-semibold ${statusStyle}`}
          >
            {request.status}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-gray-600 mt-3">
          Location: {request.location}
        </p>

        {/* Case ID */}
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
          Case Reference No: GOV-{request.id}
        </div>

      </div>
    </div>
  );
}

export default RequestCard;