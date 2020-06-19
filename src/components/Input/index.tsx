import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  refFocus,
) => {
  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocus, setIsFocus] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const handleInputblur = useCallback(() => {
    setIsFocus(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(refFocus, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocus={isFocus}>
      <Icon
        name={icon}
        size={20}
        color={isFocus || isFilled ? '#ff9000' : '#666360'}
      />
      <TextInput
        ref={inputElementRef}
        placeholderTextColor="#666360"
        {...rest}
        defaultValue={defaultValue}
        onFocus={handleInputFocus}
        onBlur={handleInputblur}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        keyboardAppearance="dark"
      />
    </Container>
  );
};
export default forwardRef(Input);
