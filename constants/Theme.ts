interface IStyling {
  color?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string | number;
}

interface IComponents {
  button: {
    primary: IStyling;
    secondary: IStyling;
    ternary: IStyling;
    primaryTrainer: IStyling;
    secondaryTrainer: IStyling;
  };
}

interface IPalette {
  primary: string;
  secondary: string;
  cyanblue: string;
  success: string;
  red: string;
  lightgrey: string;
  white: string;
  darkgrey: string;
  trasparentgray: string;
  wildsand: string;
  error: string;
  danger: string;
}

interface IFonts {
  interBlack: string;
  interBold: string;
  interExtraBold: string;
  interExtraLight: string;
  interLight: string;
  interMedium: string;
  interRegular: string;
  interSemiBold: string;
  interThin: string;
}

const colors: IPalette = {
  primary: '#1B1B30',
  secondary: '#26263B',
  cyanblue: '#52C1FF',
  success: '#73D489',
  red: '#FF5C5C',
  white: '#ECECF4',
  lightgrey: '#EFEFEF',
  darkgrey: '#9A9A9A',
  trasparentgray: 'rgba(6,0,14,0.64)',
  wildsand: '#F4F4F4',
  error: '#513036',
  danger: '#E03C3C',
};

export interface IDefaultTheme {
  palette: IPalette;
  components: IComponents;
  fonts: IFonts;
}

export const theme: IDefaultTheme = {
  palette: colors,
  fonts: {
    interBlack: 'inter-black',
    interBold: 'inter-bold',
    interExtraBold: 'inter-extra-bold',
    interExtraLight: 'inter-extra-light',
    interLight: 'inter-light',
    interMedium: 'inter-medium',
    interRegular: 'inter-regular',
    interSemiBold: 'inter-semi-bold',
    interThin: 'inter-thin',
  },
  components: {
    button: {
      primary: {
        color: colors.primary,
        background: colors.cyanblue,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      secondary: {
        color: colors.cyanblue,
        background: 'transparent',
        borderWidth: '1px',
        borderColor: colors.cyanblue,
      },
      ternary: {
        color: colors.white,
        background: colors.primary,
        borderWidth: '1px',
        borderColor: colors.white,
      },
      primaryTrainer: {
        color: colors.primary,
        background: colors.red,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      secondaryTrainer: {
        color: colors.red,
        background: 'transparent',
        borderWidth: '1px',
        borderColor: colors.red,
      },
    },
  },
};
