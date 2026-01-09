export function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return (
		<>
			<div className="backdrop" onClick={onClose} />
			<div className="modal">{children}</div>
		</>
	);
}
