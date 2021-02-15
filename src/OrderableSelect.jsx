// https://react-select.com/advanced#sortable-multiselect

import React, { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import Select, { components, createFilter } from "react-select";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

  return array;
}

const SortableMultiValue = SortableElement((props) => {
  // this prevents the menu from being opened/closed when the user clicks
  // on a value to begin dragging it. ideally, detecting a click (instead of
  // a drag) would still focus the control and toggle the menu, but that
  // requires some magic with refs that are out of scope for this example
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = { ...props.innerProps, onMouseDown };

  return <components.MultiValue {...props} innerProps={innerProps} />;
});

const SortableMultiValueLabel = SortableHandle((props) => (
  <components.MultiValueLabel {...props} />
));

const SortableSelect = SortableContainer(Select);

export default function MultiSelectSort(props) {
  const [isMounted, setIsMounted] = useState(false);
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newValue = arrayMove(props.value, oldIndex, newIndex);

    props.onChange(newValue);
  };

  useDeepCompareEffect(() => {
    if (props.options.length) {
      setIsMounted(true);
    }
  }, [props.options]);

  if (isMounted) {
    return (
      <SortableSelect
        {...props}
        useDragHandle
        // react-sortable-hoc props:
        axis="xy"
        onSortEnd={onSortEnd}
        distance={4}
        // small fix for https://github.com/clauderic/react-sortable-hoc/pull/352:
        getHelperDimensions={({ node }) => node.getBoundingClientRect()}
        // react-select props:
        isMulti
        options={props.options}
        value={props.value}
        components={{
          MultiValue: SortableMultiValue,
          MultiValueLabel: SortableMultiValueLabel,
        }}
        closeMenuOnSelect={false}
        // https://github.com/JedWatson/react-select/issues/3403#issuecomment-480183854
        filterOption={createFilter({
          matchFrom: "any",
          stringify: (option) => `${option.label}`,
        })}
      />
    );
  }

  return null;
}
