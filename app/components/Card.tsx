const Card = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="border border-black rounded-sm p-4 bg-white">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-gray-700">{content}</p>
    </div>
  );
};

export default Card;
