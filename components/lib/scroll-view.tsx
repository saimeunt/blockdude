import { ReactNode, CSSProperties } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const ScrollView = ({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: ReactNode;
}) => {
  const renderView = ({ style, ...props }: { style: CSSProperties }) => (
    <div id="scroll-view" style={{ ...style, marginRight: 0, marginBottom: -6.5 }} {...props} />
  );
  const renderThumb = ({ style, ...props }: { style: CSSProperties }) => (
    <div
      style={{
        ...style,
        backgroundColor: 'rgba(192, 192, 192, 0.75)',
        borderRadius: 9999,
        cursor: style.width ? 'ns-resize' : 'ew-resize',
      }}
      {...props}
    />
  );
  return (
    <Scrollbars
      universal
      autoHide
      style={{ width, height }}
      renderView={renderView}
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
    >
      {children}
    </Scrollbars>
  );
};

export default ScrollView;
