import PropTypes from "prop-types";

export default function CardList({ listName, listDescription, listId }) {
  return (
    <div className="w-40 min-h-40 border-2 border-secondary-light dark:border-secondary-dark flex flex-col justify-center">
      <div>
        <h1>{listName}</h1>
        <p className="text-sm mt-2">{listDescription}</p>
        <button
          type="button"
          className="border-2 rounded-full mx-2 mt-4 border-secondary-light dark:border-secondary-dark mb-2"
          onClick={() => {
            window.location.href = `/list/${listId}`;
          }}
        >
          Accéder a la liste
        </button>
      </div>
    </div>
  );
}

CardList.propTypes = {
  listName: PropTypes.string.isRequired,
  listDescription: PropTypes.string.isRequired,
  listId: PropTypes.number.isRequired,
};
