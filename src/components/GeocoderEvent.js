import Service from '../mixins/Service'

export default {
	name: 'GoogleMapsGeocoder',

	mixins: [
		Service,
	],

	props: {
		disablePlaceDetails: {
			type: Boolean,
			default: false,
		},
	},

	methods: {
		createServices () {
			this.$_geocoder = new window.google.maps.Geocoder()
		},

		update () {
			if (this.googleMapsReady) {
				this.loading = true
				this.$_geocoder.geocode(this.request, (results, status) => {
					this.$emit('geocode', results)
					this.setResults(results, status)
					this.loading = false
				})
			}
		},
	},
}
