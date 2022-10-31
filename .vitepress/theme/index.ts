import LayoutPage from "./Layout.vue";
import DefaulTheme from "vitepress/theme";

// import "./styles/style.css";
import "./styles/color_base.css";
import "./styles/common.css";
import "./styles/component.css";
import "./styles/font.css";
import "./styles/theme.css";

export default {
  ...DefaulTheme,
  Layout: LayoutPage,
};
