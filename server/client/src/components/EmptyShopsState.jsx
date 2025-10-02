import thinking from "../assets/thinking.png";

const EmptyShopState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-xl mt-3 mx-10">
      <img src={thinking} className="h-16 w-16 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Aucune shop</h2>
      <p className="text-center max-w-sm">
        Il n'y a pas encore de boutiques avec ces caracteristiques. Explorez
        d'autres boutiques !
      </p>
    </div>
  );
};

export default EmptyShopState;
