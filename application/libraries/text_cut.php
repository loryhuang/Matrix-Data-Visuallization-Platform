<?php
    class Text_cut{
        function textCut($text, $length){
            $shortText = substr($text, 0, $length);
            $tmp = array(
                $shortText . '...', $text
            ); 
            return $tmp;
        }
    }
?>
