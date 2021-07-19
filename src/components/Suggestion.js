const Suggestion = (props) => {
  const {
    suggestions,
    searchField,
    onSelectSuggestion,
    displaySuggestions,
    selectedSuggestion,
  } = props

  if (searchField && displaySuggestions) {
    if (suggestions.length > 0) {
      return (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => {
            const isSelected = selectedSuggestion === index
            const classname = `suggestion ${isSelected ? 'selected' : ''}`
            return (
              <li
                key={index}
                className={classname}
                onClick={() => onSelectSuggestion(index)}
              >
                {suggestion}
              </li>
            )
          })}
        </ul>
      )
    } else {
      return <div>No suggestions available...</div>
    }
  }
  return <></>
}

export default Suggestion
