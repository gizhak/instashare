export const uploadService = {
	uploadImg,
}

async function uploadImg(file) {
	const CLOUD_NAME = 'vanilla-test-images'
	const UPLOAD_PRESET = 'stavs_preset'
	const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

	const formData = new FormData()

	// Building the request body
	// Support both file object and event object
	const imageFile = file instanceof File ? file : file.target.files[0]
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