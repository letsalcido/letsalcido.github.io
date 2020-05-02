import React from "react";
import styles from './styles.module.scss';

type Props = {
    children: any,
    onClick?: () => void,
    link?: string,
    target?: "_blank" | "_new"
}

export default function Button(props: Props) : React.FunctionComponentElement<any> {
    const {children, onClick, link, target} = props;

    if(link) {
        return (
            <a className={styles.button} onClick={onClick} href={link} target={target}>{children}</a>
        );
    }

    return (
      <button className={styles.button} onClick={onClick}>{children}</button>
    );
}