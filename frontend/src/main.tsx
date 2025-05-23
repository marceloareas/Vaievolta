import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<Suspense fallback={<div>Carregando...</div>}>
		<BrowserRouter>
			<StyleSheetManager shouldForwardProp={(prop) => prop !== "shake"}>
				<UserProvider>
					<App />
				</UserProvider>
			</StyleSheetManager>
		</BrowserRouter>
	</Suspense>
);