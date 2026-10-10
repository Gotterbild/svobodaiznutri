whenDOMReady(() => {
	// burger mobile menu
	const burger = document.querySelector('.burger')
	const menu = document.querySelector('.menu-mobile')
	burger.addEventListener('click', (event) => {
		event.preventDefault();
		burger.classList.toggle('close')
		menu.classList.toggle('show')
	})

	initLightbox()

})

// Photo galleries and big images in posts: click to see the full-size photo
function initLightbox() {
	const galleries = [...document.querySelectorAll('.gal')]
	const images = [...document.querySelectorAll('#content article .text img')]
		.filter(img => !img.closest('.gal'))
	if (!galleries.length && !images.length) return

	const box = document.createElement('div')
	box.className = 'lightbox'
	box.hidden = true
	box.innerHTML = `
		<button class="lightbox-close" aria-label="Закрыть">&times;</button>
		<button class="lightbox-prev" aria-label="Предыдущее фото">&lsaquo;</button>
		<figure><img alt=""><figcaption></figcaption></figure>
		<button class="lightbox-next" aria-label="Следующее фото">&rsaquo;</button>
	`
	document.body.appendChild(box)
	const img = box.querySelector('img')
	const caption = box.querySelector('figcaption')
	let photos = []
	let index = 0

	function show(i) {
		index = (i + photos.length) % photos.length
		const photo = photos[index]
		img.src = photo.dataset.full || photo.src
		img.alt = photo.alt
		caption.textContent = photo.title || photo.alt
		box.classList.toggle('single', photos.length < 2)
	}
	function open(group, photo) {
		photos = group
		show(photos.indexOf(photo))
		box.hidden = false
		document.body.classList.add('lightbox-open')
	}
	function close() {
		box.hidden = true
		img.removeAttribute('src')
		document.body.classList.remove('lightbox-open')
	}

	galleries.forEach(gallery => {
		const group = [...gallery.querySelectorAll('img')]
		gallery.addEventListener('click', (event) => {
			if (event.target.tagName === 'IMG') open(group, event.target)
		})
	})

	// A single image is zoomable when a full-size copy exists or the photo is shown scaled down
	function markZoomable(photo) {
		if (photo.dataset.full || photo.naturalWidth > photo.clientWidth * 1.2) {
			photo.classList.add('zoomable')
		}
	}
	images.forEach(photo => {
		if (photo.complete) markZoomable(photo)
		else photo.addEventListener('load', () => markZoomable(photo))
		photo.addEventListener('click', () => {
			if (photo.classList.contains('zoomable')) open([photo], photo)
		})
	})

	box.addEventListener('click', (event) => {
		if (event.target.closest('.lightbox-prev')) show(index - 1)
		else if (event.target.closest('.lightbox-next')) show(index + 1)
		else if (event.target !== img) close()
	})
	document.addEventListener('keydown', (event) => {
		if (box.hidden) return
		if (event.key === 'Escape') close()
		if (event.key === 'ArrowLeft') show(index - 1)
		if (event.key === 'ArrowRight') show(index + 1)
	})
}

function whenDOMReady(func) {
	if (document.readyState !== 'loading')
	  func()
	else
	  document.addEventListener('DOMContentLoaded', func)
}
