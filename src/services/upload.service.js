export const uploadService = {
	uploadImg,
}

// Compress image before upload
async function compressImage(file, maxSizeMB = 10, maxWidthOrHeight = 1920) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = (event) => {
			const img = new Image()
			img.src = event.target.result
			img.onload = () => {
				const canvas = document.createElement('canvas')
				let width = img.width
				let height = img.height

				// Resize if needed
				if (width > height) {
					if (width > maxWidthOrHeight) {
						height *= maxWidthOrHeight / width
						width = maxWidthOrHeight
					}
				} else {
					if (height > maxWidthOrHeight) {
						width *= maxWidthOrHeight / height
						height = maxWidthOrHeight
					}
				}

				canvas.width = width
				canvas.height = height

				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0, width, height)

				// Start with quality 0.9 and reduce if needed
				let quality = 0.9
				const tryCompress = () => {
					canvas.toBlob((blob) => {
						if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
							resolve(new File([blob], file.name, { type: 'image/jpeg' }))
						} else {
							quality -= 0.1
							tryCompress()
						}
					}, 'image/jpeg', quality)
				}
				tryCompress()
			}
			img.onerror = reject
		}
		reader.onerror = reject
	})
}

async function uploadImg(file) {
	const CLOUD_NAME = 'vanilla-test-images'
	const UPLOAD_PRESET = 'stavs_preset'
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

	const formData = new FormData()

	// Building the request body
	// Support both file object and event object
	let imageFile = file instanceof File ? file : file.target.files[0]

	// Compress image if larger than 8MB (leaving some margin for the 10MB limit)
	if (imageFile.size > 8 * 1024 * 1024) {
		console.log('Image is large, compressing...')
		imageFile = await compressImage(imageFile, 8)
	}

	formData.append('file', imageFile)
	formData.append('upload_preset', UPLOAD_PRESET)

	// Sending a post method request to Cloudinary API
	try {
		const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
		const imgData = await res.json()
		console.log('Cloudinary response:', imgData)

		if (!res.ok) {
			throw new Error(`Upload failed: ${imgData.error?.message || 'Unknown error'}`)
		}

		const url = imgData.secure_url || imgData.url
		if (!url) {
			throw new Error('No URL returned from Cloudinary')
		}

		return url
	} catch (err) {
		console.error('Upload error:', err)
		throw err
	}
}