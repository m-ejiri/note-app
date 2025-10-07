// import { Authenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";
// import outputs from "../amplify_outputs.json";
// import { Amplify } from "aws-amplify";

// Amplify.configure(outputs);

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={reactLogo} className="logo react" alt="React logo" />
//         <h1>Hello from Amplify</h1>
//       </header>
//     </div>
//     <Authenticator>
//       {({ signOut, user }) => (
//         <main>
//           <h1>Hello {user.username}</h1>
//           <button onClick={signOut}>Sign out</button>
//         </main>
//       )}
//     </Authenticator>
//   );
// }
// export default App;

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

// 型なしでOK
const client = generateClient();

function App() {
  const [todos, setTodos] = useState([]);
  const { signOut } = useAuthenticator();

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    // 開発サーバーのHMRでもリークしないようにクリーンアップ
    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (!content) return;
    client.models.Todo.create({ content });
  }

  function deleteTodo(todo) {
    if (!todo) return;
    client.models.Todo.delete({ id: todo.id });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo)} key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>
      <div>App successfully hosted. Try creating a new todo.</div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
