import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import FormContainer from '../../Shared/Form/FormContainer';
import Input from '../../Shared/Form/Input';
import Error from '../../Shared/Error';
import StyledButton from '../../Shared/StyledComponents/StyledButton';
//Context
import AuthGlobal from '../../Context/store/AuthGlobal';
import { loginUser } from '../../Context/actions/Auth.actions';

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      props.navigation.navigate('User Profile');
    }
  }, [context.stateUser.isAuthenticated]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };
    if (email === '' || password === '') {
      setError('Vui lòng nhập đủ thông tin');
    } else {
      setError();
      loginUser(user, context.dispatch);
    }
  };
  return (
    <FormContainer title={'Đăng nhập'}>
      <Input
        placeholder={' Email'}
        name={'email'}
        id={'email'}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder={' Mật khẩu'}
        name={'password'}
        id={'password'}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text.toLowerCase())}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <StyledButton large primary onPress={() => handleSubmit()}>
          <Text style={styles.btnText}>Login</Text>
        </StyledButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Vẫn chưa có tài khoản?</Text>
        <StyledButton
          large
          secondary
          onPress={() => props.navigation.navigate('Register')}
        >
          <Text style={styles.btnText}>Đăng ký</Text>
        </StyledButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: '80%',
    alignItems: 'center',
  },
  middleText: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  btnText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Login;
