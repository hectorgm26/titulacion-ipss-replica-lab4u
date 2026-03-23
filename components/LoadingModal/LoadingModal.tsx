import { ActivityIndicator, Modal } from "@react-native-blossom-ui/components";
import { View } from "react-native";
import { styles } from "./LoadingModal.styles";

interface Props {
  show: boolean;
  text?: string;
}

export default function LoadingModal({ show, text }: Props) {
  return (
    <Modal
      visible={show}
      contentStyle={{
        backgroundColor: "#fff",
        borderColor: "#00a680",
        borderWidth: 3,
        borderRadius: 10,
      }}
    >
      <View style={styles.view}>
        <ActivityIndicator
          color="#00a680"
          size={80}
          label={text ? text : "Loading..."}
          labelStyle={{
            fontSize: 18,
            color: "#00a680",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        />
      </View>
    </Modal>
  );
}

LoadingModal.defaultProps = {
  show: false,
};
