export function Modal({ isOpen, onClose, children, variant = 'menu' }) {
	if (!isOpen) return null;

	return (
		<>
			{variant === 'comments' && (
				<button className="close-btn-modal" onClick={onClose}>
					✕
				</button>
			)}
			<div className="backdrop" onClick={onClose} />
			<div className={`modal modal-${variant}`}>{children}</div>
		</>
	);
}
