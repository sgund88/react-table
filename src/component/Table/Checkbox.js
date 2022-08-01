// Copyright 2022 NXGN Management, LLC. All Rights Reserved

import React from 'react';

const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
	const defaultRef = React.useRef();
	const resolvedRef = ref || defaultRef;

	React.useEffect(() => {
		resolvedRef.current.indeterminate = indeterminate;
	}, [resolvedRef, indeterminate]);

	return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

export default Checkbox;
