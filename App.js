import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const App = () => {
  //const test = 'test.jpg'
  const [img_name, setImgName] = useState('');
  const handleImgName = (imgName) => {
    
    setImgName(imgName)
    
  }

  const [show , setShow] = useState(false);
  const handleOnClick = () => {
    setShow(true);
  }
  
  const IMAGE_PATH = 'https://www.rover.com/blog/wp-content/uploads/2021/06/goudacheeeese-1024x1024.jpg'
  
  const checkPermission = async() => {
    if(Platform.OS === 'ios') {
      downloadImage()
    }else {
      try{
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download'
        }
        ) 
        if (granted === PermissionsAndroid.RESULTS.GRANTED){
          
          console.log('Storage permission granted')
          //get name from download image and pass to handleimgname
          const getName = await downloadImage()
          //wait 5 seconds for image to fully save
          if (getName){
            setTimeout(() => handleImgName(getName), 5000);
          }
          alert(getName)
          setShow(true)
                    
        }else{
          alert('Storage permission not granted')
        }
        
      }catch(error){
       console.warn(error)
      }
    }
  }
  

   const downloadImage = async () => {
    let date = new Date()
    let image_URL = IMAGE_PATH
    let ext = getExtension(image_URL)
    ext = '.'+ext[0]

    //get config and fs from RNFetchBlob
    const {config, fs} = RNFetchBlob

    const dirs = fs.dirs; //Use the dir API
    
    const newDir =  dirs.PictureDir+ '/reactsavedata';
    fs
      .mkdir(newDir)
      .catch(err => {
        console.log(err);
      });

    let PictureDir = newDir

    //get var name to save image with so we can use that name to display it
    const randd =  Math.floor(date.getTime()+date.getSeconds()/2)
    const generated_img_path = PictureDir + '/image_' +
     randd + ext
    

    let options = {
      fileCache: true,
      addAndroidDownloads:{
        useDownloadManager:true,
        notification:true, 
        path: generated_img_path,
        description: 'Image'
      }
    }
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      console.log('res-> ',JSON.stringify(res))
    })
    return 'image_'+randd + ext
  }
  
  const getExtension = filename => {
    return /[.]/.exec(filename)? /[^.]+$/.exec(filename): undefined
  }


  return (
    <View style = {{flex: 1}}>
      <TouchableOpacity
        style={styles.button}
        onPress={checkPermission}>
        <Text style={styles.text}>
          Download Image
        </Text>

      </TouchableOpacity>

      <View>
        <TouchableOpacity style={styles.button} onPress={handleOnClick}>
          <Text>button</Text>
        </TouchableOpacity>
        {
          show && <Image source={{uri:`file:///storage/emulated/0/Pictures/reactsavedata/${img_name}`}} style={{marginLeft:20, width: 100, height: 100 }}/>

        }
      
        
    </View>
    </View>

    
  )
}



const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'skyblue',
  },
  text:{
    color: '#fff',
    fontSize:20,
    textAlign: 'center'
  },
  image:{
    width:'100%',
    height: 250,
    resizeMode:'contain',
    margin:5
  }
});

export default App;
