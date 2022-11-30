type TConstants = {
	url: (vin: string) => string;
	tablesSelector: string;
	photosSelector: string;
	errorSelector: string;
	photosDownloadSelector: string;
}

export const ERROR_TEXT_IN_DOM = 'Vehicle Not found';

export default <TConstants> {
	url: (vin) => `https://w8shippingua.com/tracking/?lot=&vin=${vin}&searchAuto=Search+%C2%BB`,
	tablesSelector: 'td.details-cell',
	photosSelector: '.photos__gallery .gallery__link',
	errorSelector: '.indent .message span',
	photosDownloadSelector: '.photos-controls .photos-controls__btn'
}

