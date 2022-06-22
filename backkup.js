import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const App = () => {
  const IMAGE_PATH = 'https://playingfor90.com/wp-content/uploads/getty-images/2018/08/1328694741.jpeg'
  
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
          downloadImage()
        }else{
          alert('Storage permission not granted')
        }
      }catch(error){
       console.warn(error)
      }
    }
  }

  const downloadImage = () => {
    let date = new Date()
    let image_URL = IMAGE_PATH
    let ext = getExtension(image_URL)
    ext = '.'+ext[0]
    //get config and fs from RNFetchBlob
    const {config, fs} = RNFetchBlob
    let PictureDir = fs.dirs.PictureDir
    let options = {
      fileCache: true,
      addAndroidDownloads:{
        useDownloadManager:true,
        notification:true, 
        path: PictureDir + '/image_' +
        Math.floor(date.getTime()+date.getSeconds()/2) + ext,
        description: 'Image'
      }
    }
    config(options)
    .fetch('GET', image_URL)
    .then(res => {
      //showing alert after success downloading
      console.log('res-> ',JSON.stringify(res))
      alert('Image downloaded')
    })
  }
  
  const getExtension = filename => {
    return /[.]/.exec(filename)? /[^.]+$/.exec(filename): undefined
  }
  return (
    <View style = {{flex: 1}}>
      <Image
        source={{uri: IMAGE_PATH}}
        style = {styles.image}
        />
      <TouchableOpacity
        style={styles.button}
        onPress={checkPermission}>
        <Text style={styles.text}>
          Download Image
        </Text>

      </TouchableOpacity>
    </View>


  )
}



const styles = StyleSheet.create({
  button: {
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