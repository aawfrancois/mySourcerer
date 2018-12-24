import React, { Component } from "react";
import { Form, Icon, Input, Button, Tag } from "antd";
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import "antd/dist/antd.css";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const ADD_USER = gql`
  mutation register($nickname: String!, $email: String!, $password: String!, $password_confirmation: String!) {
    addUser(nickname: $nickname, email: $email, password: $password, password_confirmation: $password_confirmation) {
      id
      nickname
      email
    }
  }
`
class HorizontalLoginForm extends Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const nicknameError =
      isFieldTouched("nickname") && getFieldError("nickname");
    const emailError = isFieldTouched("email") && getFieldError("email");
    const passwordConfirmationError =
      isFieldTouched("passwordConfirmation") &&
      getFieldError("passwordConfirmation");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");

    return (
      <Mutation mutation={ADD_USER}>
        {(register, {error, loading, data}) => {
          if (data) {
            this.props.handleUser(data.addUser)
          }

          return (
          <Form
            layout="inline"
            onSubmit={e => {
              e.preventDefault();
              this.props.form.validateFields((err, values) => {
                if (!err) {
                  console.log("Received values of form: ", values);
                  register({variables: values})
                }
              });
            }}
          >
            <FormItem
              validateStatus={nicknameError ? "error" : ""}
              help={nicknameError || ""}
            >
              {getFieldDecorator("nickname", {
                rules: [
                  { required: true, message: "Please input your nickname!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Nickname"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={emailError ? "error" : ""}
              help={emailError || ""}
            >
              {getFieldDecorator("email", {
                rules: [
                  { required: true, message: "Please input your email!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={passwordError ? "error" : ""}
              help={passwordError || ""}
            >
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: "Please input your Password!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem
              validateStatus={passwordConfirmationError ? "error" : ""}
              help={passwordConfirmationError || ""}
            >
              {getFieldDecorator("password_confirmation", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password confirmation!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password confirmation"
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                Log in
              </Button>
            </FormItem>

            {error && (
              <>
              <br />
              <Tag color="red">{error.message}</Tag>
              </>
            )}

          </Form>
        )}}
      </Mutation>
    );
  }
}

export default Form.create()(HorizontalLoginForm);
