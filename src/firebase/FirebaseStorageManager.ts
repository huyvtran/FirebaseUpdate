import { Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';


const Blob = RNFetchBlob.polyfill.Blob
/**
 * upload image to firebase storage , containe two  step : 
 * STEP 1: read image to base64 code
 * STEP 2: add this encdoe image to firebase storage 
 * this function return a firbase url image 
 * @param {iamge object} image 
 * @param {*} mime 
 */
function uploadImgaeFirebaseStorage(image, mime = 'application/octet-stream') {

    const uploadUri = Platform.OS === 'ios' ? image.uri : `file://${image.path}`;

    let uploadBlob = null;

    const fileName = getFileName(uploadUri)

    const imageRef = storage().ref(`/${fileName}/`);

    return Blob.build(image.data, { type: `${mime};BASE64` })
        .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob._ref, { contentType: mime })
        })
        .then(() => {
            uploadBlob.close()
            return imageRef.getDownloadURL()
        })
        .catch((error) => {
            console.log("uploadImgaeFirebaseStorage >>", error)
        })
}

/**
 * Lấy thông tin của file ảnh
 * @param path 
 */
const getFileName = (path) => {
    if (!path) return '';
    const startIndex = (path.indexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/'));
    let filename = path.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    return filename;
}

export default { uploadImgaeFirebaseStorage }