import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FormContainer from '../../Shared/Form/FormContainer';
import Input from '../../Shared/Form/Input';
import StyledButton from '../../Shared/StyledComponents/StyledButton';
import Error from '../../Shared/Error';
import Icon from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseUrl';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';

const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState();
  const [description, setDescription] = useState('');
  const [richDescription, setRichDescription] = useState('');
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [error, setError] = useState();
  const [countInStock, setCountInStock] = useState();
  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);
  const [baseImage, setBaseImage] = useState();

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setBrand(props.route.params.item.brand);
      setName(props.route.params.item.name);
      setPrice(props.route.params.item.price.toString());
      setDescription(props.route.params.item.description);
      setMainImage(props.route.params.item.image);
      setImage(props.route.params.item.image);
      setBaseImage(props.route.params.item.image);
      setCategory(props.route.params.item.category._id);
      setCountInStock(props.route.params.item.countInStock.toString());
    }
    AsyncStorage.getItem('jwt')
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((error) => alert('Lỗi khi tải danh mục'));

    //image picker
    async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
          alert('Xin lỗi, chúng tôi phải có quyền truy cập để chọn hình ảnh');
        }
      }
    };
    getCategories();

    return () => {
      setCategories([]);
    };
  }, []);

  const getCategories = () => {
    const newList = categories.map((c) => {
      return { label: c.name, value: c._id, key: c._id };
    });
    return newList;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
      base64: true,
    });

    if (!result.canceled) {
      setMainImage(result.assets[0].base64);
      setImage(result.assets[0].base64);
      setBaseImage(`data:image/png;base64,${mainImage}`);
    }
  };

  const addProduct = () => {
    if (
      name === '' ||
      brand === '' ||
      price === '' ||
      description === '' ||
      category == '' ||
      category == null ||
      countInStock === ''
    ) {
      setError('Vui lòng điền đầy đủ thông tin ');
      setTimeout(() => {
        setError(null);
      }, 1000);
    }

    let formData = new FormData();

    formData.append('category', category);
    formData.append('image', baseImage);
    formData.append('name', name);
    formData.append('brand', brand);
    formData.append('price', Number(price));
    formData.append('description', description);
    formData.append('countInStock', Number(countInStock));
    formData.append('richDescription', richDescription);
    formData.append('rating', Number(rating));
    formData.append('numReviews', Number(numReviews));
    formData.append('isFeatured', isFeatured);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      axios
        .put(`${baseURL}products/${item._id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: 'success',
              text1: 'Đã cập nhật sản phẩm thành công',
              text2: '',
            });

            setTimeout(() => {
              props.navigation.navigate('Products');
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Đã xảy ra sự cố',
            text2: 'Vui lòng thử lại',
          });
        });
    } else {
      axios
        .post(`${baseURL}products/base`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: 'success',
              text1: 'Sản phẩm mới được thêm',
              text2: '',
            });

            setTimeout(() => {
              props.navigation.navigate('Products');
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: 'error',
            text1: 'Đã xảy ra sự cố',
            text2: 'Vui lòng thử lại',
          });
        });
    }
  };

  return (
    <FormContainer title='Sản phẩm'>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: baseImage }} />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon style={{ color: 'white' }} name='camera' />
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text>Thương hiệu</Text>
      </View>
      <Input
        placeholder='Thương hiệu'
        name='brand'
        id='brand'
        value={brand}
        onChangeText={(text) => setBrand(text)}
      />
      <View style={styles.label}>
        <Text>Tên sản phẩm</Text>
      </View>
      <Input
        placeholder='Tên sản phẩm'
        name='name'
        id='name'
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <View style={styles.label}>
        <Text>Giá sản phẩm</Text>
      </View>
      <Input
        placeholder='Giá sản phẩm'
        name='price'
        id='price'
        value={price}
        keyboardType={'numeric'}
        onChangeText={(text) => setPrice(text)}
      />
      <View style={styles.label}>
        <Text>Số lượng</Text>
      </View>
      <Input
        placeholder='Stock'
        name='stock'
        id='stock'
        value={countInStock}
        keyboardType={'numeric'}
        onChangeText={(text) => setCountInStock(text)}
      />
      <View style={styles.label}>
        <Text>Mô tả sản phẩm</Text>
      </View>
      <Input
        placeholder='Mô tả sản phẩm'
        name='description'
        id='description'
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <View style={styles.label}>
        <Text>Danh mục sản phẩm</Text>
      </View>
      <View style={styles.picker}>
        <RNPickerSelect
          placeholder={{ label: 'Danh mục', value: null }}
          onValueChange={(value) => setCategory(value)}
          items={getCategories()}
          style={{ placeholder: { paddingLeft: 10 } }}
        />
      </View>
      {error ? <Error message={error} /> : null}
      <View style={styles.btnContainer}>
        <StyledButton
          large
          primary
          style={styles.styledBtn}
          onPress={() => addProduct()}
        >
          <Text style={styles.btnText}>Submit</Text>
        </StyledButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: '80%',
    marginTop: 10,
  },
  picker: {
    width: '80%',
    margin: 10,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'orange',
  },
  styledBtn: {
    alignItems: 'center',
  },
  btnContainer: {
    width: '80%',
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: 'solid',
    borderWidth: 8,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#E0E0E0',
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  imagePicker: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: 'grey',
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default ProductForm;
