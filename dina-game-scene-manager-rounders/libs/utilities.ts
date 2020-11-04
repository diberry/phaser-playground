export namespace Utils {
    export class ObjectUtils {

        // -------------------------------------------------------------------------
        public static loadJson(fileName: string): Promise<any> {

            return new Promise(function (resolve, reject) {

                var request = new XMLHttpRequest();

                request.open('GET', fileName, true);
                request.responseType = 'json';

                request.onload = function () {
                    if (request.status === 200) {
                        console.log("status 200");
                        console.log(JSON.stringify(request.response));
                        resolve(request.response);
                    } else {
                        console.log(request.statusText);
                        reject(new Error(`Error loading ${fileName}: ${request.statusText}`));
                    }
                };

                request.onerror = function () {
                    console.log(`Network error while loading`);
                    reject(new Error(`Network error while loading ${fileName}`));
                };

                request.send();
            });
        }

        // -------------------------------------------------------------------------
        public static loadValuesIntoObject(jsonData: any, targetObject: any) {

            console.log(`----- loading values into ${targetObject.name} -----`);

            for (let property in jsonData) {
                console.log(`name = ${property}, value = ${jsonData[property]}`);
                targetObject[property] = jsonData[property];
            }

            console.log("------------------------------------------------");
        }
    }
    export interface ISponsorStorage {
        /** 
         * sponsor specific save method - to some sponsor storage
         */
        save(key: string, data: any): Promise<void>;
        /** 
         * sponsor specific load method - to some sponsor storage
         */
        load(key: string): Promise<any>;
        /** 
         * if true, loading/saving is first attempted from sponsor specific methods and then to/from standar storage
         * if false, only specific methods are used
         */
        fallbackToStandardStorage(): boolean;
    }


    export class StorageUtils {

        private static _sponsorStorage: ISponsorStorage = null;

        private static _allowMultipleRequests: boolean = false;
        private static _requestsCounter: number = 0;

        // --------------------------------------------------------------------
        public static set sponsorStorage(sponsorStorage: ISponsorStorage) {
            StorageUtils._sponsorStorage = sponsorStorage;
        }

        // --------------------------------------------------------------------
        public static set allowMultipleRequests(allowMultipleRequests: boolean) {
            StorageUtils._allowMultipleRequests = allowMultipleRequests;
        }

        // --------------------------------------------------------------------
        public static async save(key: string, data: any): Promise<void> {

            // check if any load/save request is still running
            if (!StorageUtils._allowMultipleRequests && StorageUtils._requestsCounter > 0) {
                throw new Error("Previous load/save request was not finished yet");
            }
            ++StorageUtils._requestsCounter;


            // sponsor specific storage?
            let sponsorStorage = StorageUtils._sponsorStorage;
            if (sponsorStorage !== null) {
                // save
                await sponsorStorage.save(key, data);

                // fallback set to true? Use also standard local storage?
                if (!sponsorStorage.fallbackToStandardStorage()) {
                    --StorageUtils._requestsCounter;
                    return;
                }
            }


            // standard storage
            let storage = StorageUtils.getLocalStorage();

            if (storage !== null) {
                let dataString = JSON.stringify(data);

                console.log(`saving key ${key}: ${dataString}`);

                storage.setItem(key, dataString);

            } else {
                --StorageUtils._requestsCounter;
                throw new Error("Standard storage not available");
            }

            --StorageUtils._requestsCounter;
        }

        // --------------------------------------------------------------------
        public static async load(key: string): Promise<any> {

            // check if any load/save request is still running
            if (!StorageUtils._allowMultipleRequests && StorageUtils._requestsCounter > 0) {
                throw new Error("Previous load/save request was not finished yet");
            }
            ++StorageUtils._requestsCounter;


            let data = null;

            // sponsor specific storage?
            let sponsorStorage = StorageUtils._sponsorStorage;
            if (sponsorStorage !== null) {
                // save
                data = await sponsorStorage.load(key);

                // if got some data (not null or undefined) or fallback to standard storage not not allowed
                if (data != null || !sponsorStorage.fallbackToStandardStorage()) {
                    --StorageUtils._requestsCounter;
                    return data;
                }
            }


            // standard storage
            let storage = StorageUtils.getLocalStorage();

            if (storage !== null) {
                let dataString = storage.getItem(key);

                console.log(`loading key ${key}: ${dataString}`);

                data = JSON.parse(dataString);

            } else {
                --StorageUtils._requestsCounter;
                throw new Error("Standard storage not available");
            }

            --StorageUtils._requestsCounter;

            return data;
        }

        // --------------------------------------------------------------------
        private static getLocalStorage(): Storage {
            try {
                if ("localStorage" in window && window["localStorage"] != null) {
                    return localStorage;
                }
            } catch (e) {
                return null;
            }

            return null;
        }
    }
}
