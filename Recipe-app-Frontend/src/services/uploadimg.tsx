import axios from 'axios';

interface IUploadImage {
    url: string;
}
 export const uploadImage = async (img:File) => {
    return new Promise<string>((resolve, reject) => {
    console.log('uploading'+img);
    const formData = new FormData();
    if(img){
      formData.append('file', img);
      axios.post<IUploadImage>('https://193.106.55.205/file?file=123.jpg', formData, {
        headers: {
          'Content-Type': 'image/jpeg'
        }
      }).then((response) => {
        resolve(response.data.url);
      }).catch((error) => {
        console.error('Image upload failed', error);
        reject(error);}
      
      );
    }
  }
    )};

 