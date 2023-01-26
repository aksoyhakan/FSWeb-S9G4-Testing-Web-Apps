import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
  const greeting = screen.getByText(/Entegrasyon Test Projesi/i);
  expect(greeting).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(nameInput, "Hak");
  const errorDiv = await screen.findByTestId("error");
  expect(errorDiv).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const surnameInput = screen.getByPlaceholderText(/Mansız/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Hak");
  userEvent.type(surnameInput, "a");
  userEvent.clear(surnameInput);
  userEvent.type(emailInput, "sda");
  const errorDivName = await screen.findAllByTestId("error");
  expect(errorDivName.length).toEqual(3);
  userEvent.clear(nameInput);
  userEvent.clear(surnameInput);
  userEvent.clear(emailInput);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const surnameInput = screen.getByPlaceholderText(/Mansız/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Hakan");
  userEvent.type(surnameInput, "Aksoy");
  userEvent.type(emailInput, "sda");
  const errorDivName = await screen.findAllByTestId("error");
  expect(errorDivName.length).toEqual(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(emailInput, "sda");
  const errorDivName = await screen.findAllByTestId("error");
  expect(errorDivName[0]).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Hakan");
  userEvent.type(emailInput, "aksoyhakan@1990gmail.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  const errorDiv = await screen.findByTestId("error");
  expect(errorDiv).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const surnameInput = screen.getByPlaceholderText(/Mansız/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Hakan");
  userEvent.type(surnameInput, "Aksoy");
  userEvent.type(emailInput, "aksoyhakan@1990gmail.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorDiv = screen.queryAllByTestId("error");
    expect(errorDiv.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const nameInput = screen.getByPlaceholderText(/İlhan/);
  const surnameInput = screen.getByPlaceholderText(/Mansız/);
  const emailInput = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/);
  userEvent.type(nameInput, "Hakan");
  userEvent.type(surnameInput, "Aksoy");
  userEvent.type(emailInput, "aksoyhakan@1990gmail.com");
  const submitButton = screen.getByText(/Gönder/);
  userEvent.click(submitButton);
  await waitFor(() => {
    const displayNameInput = screen.getByTestId("firstnameDisplay");
    const displaySurnameInput = screen.getByTestId("lastnameDisplay");
    const displayEmailInput = screen.getByTestId("emailDisplay");
    expect(displayNameInput).toHaveTextContent("Hakan");
    expect(displaySurnameInput).toHaveTextContent("Aksoy");
    expect(displayEmailInput).toHaveTextContent("aksoyhakan@1990gmail.com");
  });
});
