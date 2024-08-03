
import React, { useState } from 'react';
//Firebase instances
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// import axios from 'axios'
//gemini api
import { GoogleGenerativeAI } from "@google/generative-ai"

function WardrobeUpload() {
  const [image, setImage] = useState(null);
  const storage = getStorage();
  const currentUser = 'WGfWft8RyseJnCBYYAsGHWiBGiS2' //will change on authentication

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    // get storage ref to upload
    const storageRef = ref(storage, `wardrobeImages/${image.mame}`);
    let imageUrl = ''
    
    //upload image to firestore storage
    try { 
        await uploadBytes(storageRef, image);
        console.log('Image uploaded successfully!');

        imageUrl = await getDownloadURL(storageRef);
        console.log('Download URL:', imageUrl);
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    // gemini api model
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    
    // converts a file object to a GoogleGenerativeAI.Part object.
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }
    
    // gemini prompt and JSON response
    async function run() {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generation_config:{"response_mime_type": "application/json"} });
    
        const prompt = `List the colors of the garment, 
        and keywords describing the style of garment, 
        Use the following JSON schema and Provide your answer in JSON form. 
        Reply with only the answer in JSON form and include no other commentary::
        Color = str
        Style = str
        return a list[ {colors:list[Color]}, {style:list[Style]} ]
        `
    
        const imagePart = await fileToGenerativePart(image)
        const result = await model.generateContent([prompt, imagePart])
        const response = await result.response;
        return JSON.parse(response.text());
    }
    
    const data = await run(); // data[0] is colors && data[1] is styles
    console.log('colors', data[0])
    console.log('styles', data[1])
   
    // Save data to Firestore along with image URL
    const db = firebase.firestore();
    await db.collection('users').doc(currentUser).collection('wardrobe').add({
        colors: data[0]['colors'],
        styles: data[1]['style'],
        imgUrl: imageUrl
    })
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload to Wardrobe</button>
    </div>
  );
}

export default WardrobeUpload;