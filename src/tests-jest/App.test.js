// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react'; // 画面上の要素を取得するための render と screen メソッドをインポート
import '@testing-library/jest-dom';
import App from '../App.jsx'; // テストファイル

test('renders login form with email and password inputs', () => {
  // Appコンポーネントをレンダリング テスト対象の UI を DOM に追加
  render(<App />);

  // タイトルが正しく表示されていることを確認
  // getByText メソッドで指定したテキストが含まれる要素を取得し、それがドキュメント内に存在するかをチェック
  expect(screen.getByText('ログイン画面')).toBeInTheDocument();

  // メールアドレスの入力フィールドが正しく表示されていることを確認
  // i : フラグ（flag）「ignore case」の略
  expect(screen.getByLabelText(/メールアドレス:/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

  // パスワードの入力フィールドが正しく表示されていることを確認
  expect(screen.getByLabelText(/パスワード:/i)).toBeInTheDocument();

  // ログインボタンが正しく表示されていることを確認
  // getByRole メソッドでボタンの役割を指定
  expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
});
