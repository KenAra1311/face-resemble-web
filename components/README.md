# COMPONENTS

## Demo.vue

サインインしていない時に表示させる部品です。

## Card.vue

投稿を取得して表示する部品です。

- user : 現在ログインしているユーザの情報を格納するための配列になります。

- posts : displayLists （ページネーション）用に加工される前に、投稿の情報を格納しておく配列になります。

- displayLists : ページネーションで表示する投稿の情報を格納する配列になります。

- length : ページネーションの項目数を出力します。（自動処理）

- pageSize : ページネーションの１ページで表示する投稿数を処理します。

## UserInfo.vue

各ユーザページのユーザの情報を表示する部品です。

- user : 現在ログインしているユーザの情報を格納するための配列になります。

- userData : ページの数字がユーザのID（users.id）となり、そのユーザの情報を格納している配列になります。

- followData : そのページに応じたユーザがフォローしている情報を格納している配列になります。

## List.vue

いいねした人リストやフォロー、フォロワーリストを表示するのに対応している部品です。

- listHeader : 画面の見出しの文言を格納している変数になります。

- lists : ユーザ情報の入っている配列になります。
