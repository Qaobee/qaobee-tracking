import {Injectable} from "@angular/core";

declare var google;

@Injectable()
export class LocationService {

    GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
    geocoder: any = new google.maps.Geocoder;

    /**
     *
     * @param address
     * @param {Function} callback
     */
    updateSearchResults(address: any, callback: Function) {
        let autocompleteItems = [];
        if (!address || address == '') {
            callback(autocompleteItems);
        }
        this.GoogleAutocomplete.getPlacePredictions({input: address}, (predictions, status) => {

            console.log('[LocationService] - updateSearchResults - getPlacePredictions', predictions, status);
            if (predictions) {
                autocompleteItems = [];
                predictions.forEach((prediction) => {
                    autocompleteItems.push(prediction);
                });
                callback(autocompleteItems);
            }
        });
    }

    /**
     *
     * @param item
     * @param address
     * @param {Function} callback
     */
    selectSearchResult(item: any, address: any, callback: Function) {
        this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
            if (status === 'OK' && results[0]) {
                console.log('[LocationService] - selectSearchResult - geocode', results[0]);
                callback(results[0]);
            }
        })
    }
}