function PrioritySelector({ selectedPriority, onPriorityChange }) {
  const priorities = [
    { value: 1, label: "High Priority", className: "priority-1" },
    { value: 2, label: "Medium Priority", className: "priority-2" },
    { value: 3, label: "Low Priority", className: "priority-3" },
  ];

  return (
    <div className="priority-selector">
      {priorities.map((priority) => (
        <div
          key={priority.value}
          className={`priority-option ${priority.className} ${
            selectedPriority === priority.value ? "selected" : ""
          }`}
          onClick={() => onPriorityChange(priority.value)}
          tittle={priority.label}
          data-priority={priority.value}
        />
      ))}
    </div>
  );
}

export default PrioritySelector;
