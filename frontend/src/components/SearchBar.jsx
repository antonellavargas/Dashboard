function SearchBar({
  value,
  onChange,
  placeholder
}) {

  return (

    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        xl:w-80
        px-4
        py-3
        rounded-2xl
        border
        bg-white
        shadow-sm
      "
    />
  );
}

export default SearchBar;