{*
* 2015 CONVERMAX CORP
*
* NOTICE OF LICENSE
*
* This source file is subject to the Open Software License (OSL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/osl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to info@convermax.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author CONVERMAX CORP <info@convermax.com>
*  @copyright  2015 CONVERMAX CORP
*  @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
*  International Registered Trademark & Property of CONVERMAX CORP
*}
{foreach from=$facets item=facet}
    {if $facet->Values}
        <div class="cm_facet">
            <p class="cm_facet_title">{$facet->DisplayName|escape:'html'}</p>
            {if $facet->IsRanged}
                {*<div class="slider_pad"><div class="cm_slider" data-fieldname="{$facet->FieldName|escape:'html'}" data-range="{$facet->Values[0]->Term|escape:'html'}"></div></div>*}
                <div class="slider_pad"><div class="cm_slider" data-fieldname="{$facet->FieldName|escape:'html'}" data-range="{$facet->Values[0]->Term|regex_replace:"/ .*\]/":""} {$facet->Values[{$facet->Values|@count}-1]->Term|regex_replace:"/\[.*? /":""}"></div></div>
            {elseif $facet->IsTree}
                <ul class="cm_tree">
                    {foreach from=$facet->Values item=val}
                        {if !$val->Selected}
                            <li><a href="#" class="cm_tree_item" data-fieldname="{$facet->FieldName|escape:'html'}" data-displayname="{$facet->DisplayName|escape:'html'}" data-value="{$val->Term|escape:'html'}">{$val->Value|escape:'html'} - ({$val->HitCount|escape:'html'})</a></li>
                        {/if}
                    {/foreach}
                </ul>
            {else}
                    <ul>
                    {foreach from=$facet->Values item=value}
                        <li>
                        <label><input type="checkbox" class="checkbox" value="{$value->Term}" data-fieldname="{$facet->FieldName}" data-displayname="{$facet->DisplayName}"{if $value->Selected} checked{/if}>{$value->Value} ({$value->HitCount})</label>
                        </li>
                    {/foreach}
                    </ul>
            {/if}
        </div>
    {/if}
{/foreach}