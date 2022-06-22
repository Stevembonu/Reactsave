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
  
  const IMAGE_PATH = 'https://assets.findcatnames.com/wp-content/uploads/2014/11/cute-kitten-names-1.jpg'
  
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
          const namee = await downloadImage()
          //wait 5 seconds for image to fully save
          if (namee){
            setTimeout(() => handleImgName(namee), 5000);
          }
          alert(namee)
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
    
    const Unread_Books =  dirs.PictureDir+ '/reactsavedata';
    fs
      .mkdir(Unread_Books)
      .catch(err => {
        console.log(err);
      });

    let PictureDir = Unread_Books

    //get var name to save image with so we can use that name to display it
    const randd =  Math.floor(date.getTime()+date.getSeconds()/2)
    const temp_img_name = PictureDir + '/image_' +
     randd + ext
    

    let options = {
      fileCache: true,
      addAndroidDownloads:{
        useDownloadManager:true,
        notification:true, 
        path: temp_img_name,
        description: 'Image'
      }
    }
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      //showing alert after success downloading
      //handleOnClick()
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