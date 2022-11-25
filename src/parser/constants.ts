type TConstants = {
	url: (vin: string) => string;
	tablesSelector: string;
	photosSelector: string;
}

export default <TConstants> {
	url: (vin) => `https://w8shippingua.com/tracking/?lot=&vin=${vin}&searchAuto=Search+%C2%BB`,
	tablesSelector: 'td.details-cell',
	photosSelector: '.photos__gallery .gallery__link'
}
