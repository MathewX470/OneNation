function RequestCard({ request }) {

  const statusStyle =
    request.status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : request.status === "Ongoing"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden 
                    hover:shadow-xl hover:-translate-y-1 
                    transition-all duration-300 cursor-pointer">

      {/* Image (if exists) */}
      {request.image && (
        <div className="h-40 w-full overflow-hidden">
          <img
            src={request.image}
            alt="request"
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">

        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {request.title}
          </h3>

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}
          >
            {request.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm">
          📍 {request.location}
        </p>

        <p className="text-gray-400 text-xs mt-2">
          Report ID: #{request.id}
        </p>

      </div>
    </div>
  );
}

export default RequestCard;