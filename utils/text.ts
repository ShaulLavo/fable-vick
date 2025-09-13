export function processPasaclCase(name: string) {
	if (name.includes(' ')) {
		const words = name.split(' ')
		return (
			words[0].charAt(0).toLowerCase() +
			words[0].slice(1) +
			words.slice(1).join('')
		)
	} else {
		const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		return spaced.charAt(0).toUpperCase() + spaced.slice(1)
	}
}
